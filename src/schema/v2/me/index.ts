import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
} from "graphql"

import { IDFields, NodeInterface } from "schema/v2/object_identification"
import { includesFieldsOtherThanSelectionSet } from "lib/hasFieldSelection"

import date from "schema/v2/fields/date"
import initials from "schema/v2/fields/initials"

import ArtworkInquiries from "./artwork_inquiries"
import BidderPositions from "./bidder_positions"
import Bidders from "./bidders"
import BidderStatus from "./bidder_status"
import { BidderPosition } from "./bidder_position"
import CollectorProfile from "./collector_profile"
import Conversation from "./conversation"
import Conversations from "./conversations"
import { CreditCards } from "./credit_cards"
import FollowedArtistsArtworkGroups from "./followed_artists_artworks_group"
import FollowedArtists from "./followed_artists"
import FollowedGenes from "./followed_genes"
import FollowedShows from "./followed_shows"
import FollowedFairs from "./followed_fairs"
import Invoice from "./conversation/invoice"
import LotStanding from "./lot_standing"
import LotStandings from "./lot_standings"
import { RecentlyViewedArtworks } from "./recently_viewed_artworks"
// import SaleRegistrations from "./sale_registrations"
import { SavedArtworks } from "./saved_artworks"
import Submissions from "./consignments/submissions"
import config from "config"
import { ResolverContext } from "types/graphql"
import { SaleArtworksConnectionField } from "../sale_artworks"

// @ts-ignore
const { ENABLE_CONVECTION_STITCHING } = config

const mySubmissions: GraphQLFieldConfigMap<
  void,
  ResolverContext
> = !!ENABLE_CONVECTION_STITCHING
  ? {}
  : { consignmentSubmissionsConnection: Submissions }

const Me = new GraphQLObjectType<any, ResolverContext>({
  name: "Me",
  interfaces: [NodeInterface],
  fields: {
    ...IDFields,
    ...mySubmissions,
    artworkInquiriesConnection: ArtworkInquiries,
    bidders: Bidders,
    bidderStatus: BidderStatus,
    bidderPositions: BidderPositions,
    bidderPosition: BidderPosition,
    collectorProfile: CollectorProfile,
    conversation: Conversation,
    conversationsConnection: Conversations,
    createdAt: date,
    creditCards: CreditCards,
    email: {
      type: GraphQLString,
    },
    followsAndSaves: {
      type: new GraphQLObjectType<any, ResolverContext>({
        name: "FollowsAndSaves",
        fields: {
          bundledArtworksByArtistConnection: FollowedArtistsArtworkGroups,
          artistsConnection: FollowedArtists,
          artworksConnection: SavedArtworks,
          showsConnection: FollowedShows,
          fairsConnection: FollowedFairs,
          genesConnection: FollowedGenes,
        },
      }),
      resolve: () => ({}),
    },
    hasCreditCards: {
      type: GraphQLBoolean,
      resolve: (_root, _options, { meCreditCardsLoader }) => {
        if (!meCreditCardsLoader) return null
        return meCreditCardsLoader().then(({ body }) => {
          return body && body.length > 0
        })
      },
    },
    hasQualifiedCreditCards: {
      type: GraphQLBoolean,
      resolve: (_root, _options, { meCreditCardsLoader }) => {
        if (!meCreditCardsLoader) return null
        return meCreditCardsLoader({ qualified_for_bidding: true }).then(
          ({ body }) => {
            return body && body.length > 0
          }
        )
      },
    },
    invoice: Invoice,
    lotsByFollowedArtistsConnection: SaleArtworksConnectionField,
    lotStanding: LotStanding,
    lotStandings: LotStandings,
    name: {
      type: GraphQLString,
    },
    initials: initials("name"),
    paddleNumber: {
      type: GraphQLString,
      resolve: ({ paddle_number }) => paddle_number,
    },
    recentlyViewedArtworkIds: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
      resolve: ({ recently_viewed_artwork_ids }) => recently_viewed_artwork_ids,
    },
    recentlyViewedArtworksConnection: RecentlyViewedArtworks,
    // saleRegistrations: SaleRegistrations,
    type: {
      type: GraphQLString,
    },
  },
})

const MeField: GraphQLFieldConfig<void, ResolverContext> = {
  type: Me,
  resolve: (_root, _options, { userID, meLoader }, info) => {
    if (!meLoader) return null
    const fieldsNotRequireLoader = [
      "id",
      "internalID",
      "creditCards",
      "hasCreditCards",
      "hasQualifiedCreditCards",
      "bidders",
      "bidderPositions",
      "bidderPosition",
      "bidderStatus",
      "lotStanding",
      "lotStandings",
      "saleRegistrations",
      "conversation",
      "conversations",
      "collectorProfile",
      "artworkInquiries",
      "consignmentSubmissions",
      "followsAndSaves",
      "lotsByFollowedArtistsConnection",
    ]
    if (includesFieldsOtherThanSelectionSet(info, fieldsNotRequireLoader)) {
      return meLoader().catch(() => null)
    }
    // The email and is_collector are here so that the type system's `isTypeOf`
    // resolves correctly when we're skipping gravity data
    return { id: userID, email: null, is_collector: null }
  },
}

export default MeField
