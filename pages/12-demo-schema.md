# Demo: Schema

```graphql {all|1-5|7-14|16-19|21-27|all}
type Client {
  id: ID!
  name: String!
  industry: String!
}

type Proposal {
  id: ID!
  client: Client!
  scope: String!
  budget: String!
  generatedContent: String!
  createdAt: DateTime!
}

type Query {
  proposals: [Proposal!]!
  proposal(id: ID!): Proposal
}

type Mutation {
  generateProposal(
    clientName: String!
    industry: String!
    scope: String!
    budget: String!
  ): Proposal!
}
```

<v-click>

<div class="text-center mt-4 text-xl">

**4 typy, 2 query, 1 mutacja. To jest cały nasz "startup" - serio.**

</div>

</v-click>

<!--
No i widzicie - to jest całe API. 4 typy, parę pól, i mamy kompletny system.
Nie trzeba dokumentacji, nie trzeba Postmana - schema mówi wszystko.
-->
