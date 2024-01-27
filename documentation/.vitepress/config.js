module.exports = {
  title: "Prici.io",
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  description: "Prici is an open-source project to manage plans and pricing for any SaaS application.",
  themeConfig: {
    logo: '/logo.jpeg',
    editLink: {
      pattern: 'https://github.com/prici-io/prici/edit/main/documentation/:path'
    },
    search: {
      provider: 'local'
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "GitHub", link: "https://github.com/prici-io/prici" },
      { text: "Discord", link: 'https://discord.gg/MXysB9twZ9' },
    ],
    sidebar: [
      {
        text: "Home",
        link: '/',
        items: [
          {
            text: "Introduction",
            link: "/content/introduction/index"
          },
          {
            text: "Custom Database",
            link: "/content/introduction/custom-database"
          },
          {
            text: "Kafka Integration",
            link: "/content/introduction/kafka"
          },
          {
            text: "NestJs Integration",
            link: "/content/introduction/nestjs"
          },
          {
            text: 'SDK',
            items: [
              {
                text: 'Node.js SDK',
                items: [
                  { text: 'Getting Started', link: '/content/sdk/node/getting-started' },
                  { text: 'Increment Field', link: '/content/sdk/node/increment-field' },
                  { text: 'Get Field State', link: '/content/sdk/node/get-field-state' },
                  { text: 'Can Exceed Limit', link: '/content/sdk/node/can-exceed-limit' },
                ]
              }
            ]
          }
        ]
      },
    ]
  }
};