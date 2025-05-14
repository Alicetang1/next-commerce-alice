export const getMenuQuery = /*graphQL*/ `

query getMenu($handle:String!){
  menu(handle:$handle){
    items{
      title
      url
    }
  }
}
`;