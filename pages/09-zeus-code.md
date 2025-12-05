# Zeus w akcji

```typescript {all|1-3|5-15|17-22|all}
// Generujemy klienta ze schemy
import { Chain } from './zeus';
const chain = Chain('https://api.example.com/graphql');

// Pełny autocomplete - IDE wie wszystko tak po prostu
const users = await chain('query')({
  users: {
    id: true,
    name: true,
    email: true,
    posts: {
      title: true,
      createdAt: true,
    },
  },
});
users.users.forEach(user => {
  console.log(user.name);    // string
  console.log(user.email);   // string
  // user.foo                // ERROR - nie ma takiego pola
});
```

<v-click>

<div class="mt-4 text-center text-xl">

**Schema się zmienia? TypeScript krzyczy. Nie produkcja.**

</div>

</v-click>

<!--
No i widzicie - to w ogóle ucina jakieś 90% komunikacji między teamami.
Frontend dokładnie wie co dostaje. Backend dokładnie wie co ma zwrócić.
Nie ma domysłów, nie ma błędów na produkcji z powodu złego typu.
-->
