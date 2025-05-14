import { seoFragment } from "./seo";

export const collectionFragment=/*Graphql */`
fragment collection on Collection{
  handle
  title
  description
  seo{
    ...seo
  }
  updatedAt
}
${seoFragment}
`;