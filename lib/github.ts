import { App, Octokit } from 'octokit';
import type { ActionResponse, Feedback } from '@/components/feedback';

// Docs GitHub repository info
export const owner = 'Sylinko';
export const repo = 'everywhere-docs';
export const DocsCategory = 'Feedback'; // GitHub Discussion

let instance: Octokit | undefined;

async function getOctokit(): Promise<Octokit> {
  if (instance) return instance;

  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;

  if (!appId || !privateKey) {
    console.warn(
      '[GitHub] No GitHub keys provided for GitHub app, docs feedback feature will not work.'
    );
    throw new Error('Document feedback is not configured.');
  }

  try {
    const app = new App({
      appId,
      privateKey,
    });

    const { data } = await app.octokit.request(
      'GET /repos/{owner}/{repo}/installation',
      {
        owner,
        repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    instance = await app.getInstallationOctokit(data.id);
    return instance;
  } catch (error) {
    const status = error && typeof error === 'object' && 'status' in error ? error.status : undefined;
    console.error('[GitHub] Failed to initialize GitHub App.', { status });
    throw new Error('Could not reach GitHub. Please retry.');
  }
}

interface RepositoryInfo {
  id: string;
  discussionCategories: {
    nodes: {
      id: string;
      name: string;
    }[];
  };
}

let cachedDestination: { repositoryId: string; categoryId: string } | undefined;
async function getFeedbackDestination(octokit: Octokit) {
  if (cachedDestination) return cachedDestination;

  const {
    repository,
  }: {
    repository: RepositoryInfo;
  } = await octokit.graphql(`
  query {
    repository(owner: "${owner}", name: "${repo}") {
      id
      discussionCategories(first: 25) {
        nodes { id name }
      }
    }
  }
`);

  const category = repository.discussionCategories.nodes.find((node) => node.name === DocsCategory);
  if (!category) throw new Error('GitHub feedback category is unavailable.');
  return (cachedDestination = { repositoryId: repository.id, categoryId: category.id });
}

export async function onRateAction(
  url: string,
  feedback: Feedback
): Promise<ActionResponse> {
  const octokit = await getOctokit();
  const { repositoryId, categoryId } = await getFeedbackDestination(octokit);

  const title = `Feedback for ${url}`;
  const body = `[${feedback.opinion}] ${feedback.message}\n\n> Forwarded from user feedback.`;

  let {
    search: {
      nodes: [discussion],
    },
  }: {
    search: {
      nodes: { id: string; url: string }[];
    };
  } = await octokit.graphql(`
          query {
            search(type: DISCUSSION, query: ${JSON.stringify(`${title} in:title repo:${owner}/${repo} author:@me`)}, first: 1) {
              nodes {
                ... on Discussion { id, url }
              }
            }
          }`);

  if (discussion) {
    await octokit.graphql(`
            mutation {
              addDiscussionComment(input: { body: ${JSON.stringify(body)}, discussionId: "${discussion.id}" }) {
                comment { id }
              }
            }`);
  } else {
    const result: {
      createDiscussion: { discussion: { id: string; url: string } };
    } = await octokit.graphql(`
            mutation {
              createDiscussion(input: { repositoryId: "${repositoryId}", categoryId: "${categoryId}", body: ${JSON.stringify(body)}, title: ${JSON.stringify(title)} }) {
                discussion { id, url }
              }
            }`);

    discussion = result.createDiscussion.discussion;
  }

  return {
    githubUrl: discussion.url,
  };
}
