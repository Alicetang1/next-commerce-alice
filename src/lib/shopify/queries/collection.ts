import {collectionFragment} from '../fragments/collection'
import { productFragment } from '../fragments/product';

export const getCollectionsQuery = /*Graphql */`
query getCollections{
  collections(first:100,sortKey:TITLE){
    edges{
      node{
        ...collection
      }
    }
  }
}
${collectionFragment}
`;

export const getCollectionProductsQuery =/*Graphql */`
query getCollectionsProducts(
  $handle:String!
  $sortKey:ProductCollectionSortKeys
  $reverse:Boolean
){
  collection(handle:$handle){
    products(sortKey:$sortKey,reverse:$reverse,first:100){
      edges{
        node{
          ...product
        }
      }
    }
  }
}
${productFragment}
`