import { create } from "lodash"
import Show from "schema/v2/show"
import Article from "schema/v2/article"
import { GraphQLUnionType } from "graphql"

export const HighlightedShowType = create(Show.type, {
  name: "HighlightedShow",
  isTypeOf: ({ highlight_type }) => highlight_type === "Show",
})

export const HighlightedArticleType = create(Article.type, {
  name: "HighlightedArticle",
  isTypeOf: ({ highlight_type }) => highlight_type === "Article",
})

export const HighlightType = new GraphQLUnionType({
  name: "Highlighted",
  types: [HighlightedShowType, HighlightedArticleType],
})

export default HighlightType
