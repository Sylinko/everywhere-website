import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import {
  CoreTeamCard,
  CommunityMemberCard,
  SponsorCard,
} from '@/components/community-cards';
import { Command } from '@/components/command';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    CoreTeamCard,
    CommunityMemberCard,
    SponsorCard,
    Command,
    ...components,
  };
}
