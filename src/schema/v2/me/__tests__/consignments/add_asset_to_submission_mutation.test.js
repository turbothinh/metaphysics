/* eslint-disable promise/always-return */
import { runAuthenticatedQuery } from "schema/v2/test/utils"
import gql from "lib/gql"

describe("addAssetToConsignmentSubmission", () => {
  it("creates a submission and returns its new data payload", () => {
    const mutation = gql`
      mutation {
        addAssetToConsignmentSubmission(
          input: {
            assetType: "image"
            geminiToken: "12345"
            submissionID: "123"
            clientMutationId: "123"
          }
        ) {
          asset {
            submissionID
            geminiToken
          }
        }
      }
    `

    const context = {
      assetCreateLoader: () =>
        Promise.resolve({
          id: "106",
          gemini_token: "12345",
          submission_id: "123",
        }),
    }

    expect.assertions(1)
    return runAuthenticatedQuery(mutation, context).then(data => {
      expect(data).toMatchSnapshot()
    })
  })
})
