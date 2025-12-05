# Axolotl w akcji

```typescript {all|1-5|7-15|17-25|all}
// Schema-first - takie podejście
import { createResolvers } from '@aexol/axolotl-core';

const resolvers = createResolvers({
  Mutation: {
    createUser: async ([,,context], {input}) => {
      // Walidacja mamy wbudowaną
      return context.db.users.create({
        data: input
      });
    },
  },
});
```

<v-click>

<div class="mt-4 text-center text-xl">

**Zero boilerplate'u. Pełne typowanie. I programista jest szczęśliwy. I AI jest bardzo szczęśliwe, bo nie musi przy kolejnym features sprawdzać wszystkich typów w projekcie**

</div>

</v-click>

<!--
No i widzicie - to po prostu działa. Nie trzeba się martwić o typowanie, o walidację.
To wszystko mamy z automatu. Skupiamy się na funkcjonalności, nie na konfiguracji.
-->
