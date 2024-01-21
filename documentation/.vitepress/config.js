module.exports = {
    title: "Prici.io",
    description: "Prici is an open-source project to manage plans and pricing for any SaaS application.",
    themeConfig: {
        nav: [
            { text: "Home", link: "/" },
            { text: "GitHub", link: "https://github.com/prici-io/prici" }
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
                        text: 'SDK',
                        items: [
                            {
                                text: 'Node.js SDK',
                                link: "/content/sdk/node-sdk"

                            }
                        ]
                    }
                ]
            },
        ]
    }
};