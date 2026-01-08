import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import {
  CoreTeamCard,
  CommunityMemberCard,
  SponsorCard,
} from '@/components/community-cards';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    CoreTeamCard,
    CommunityMemberCard,
    SponsorCard,
    ...components,
  };
}
