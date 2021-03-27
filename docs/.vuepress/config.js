module.exports = {
    title: 'Sans_',
    description: 'stay hungry，stay foolish',
    theme: 'reco',
    host: 'localhost',
    port: 8080,
    themeConfig: {
        type: 'blog',
        nav: [
            {text: '主页', link: '/'},
            {text: '心得', link: '/experience/utils'},
            {
                text: '博客', items: [
                    {text: 'JS', link: '/js/'},
                    {text: 'HTML', link: '/html/'},
                    {text: 'CSS', link: '/css/'},
                ]
            },
            {text: '关于', link: '../about'}
        ],
        // 博客设置
        blogConfig: {
            category: {
                location: 2, // 在导航栏菜单中所占的位置，默认2
                text: 'Category' // 默认 “分类”
            },
            tag: {
                location: 3, // 在导航栏菜单中所占的位置，默认3
                text: 'Tag' // 默认 “标签”
            }
        },
        // 自动形成侧边导航
        subSidebar: 'auto',
        sidebar: 'auto',
        sidebarDepth: 4,
        displayAllHeaders: false,
        sidebar: {
            '/js/': [
                {
                    title: '对象',
                    collapsable: true,
                    children: [
                        'Object/understandObject',
                        'Object/createObject',
                        'Object/extend',
                        'Object/prototype',
                    ]
                },
            ],
            '/css/': [
                '',
                'skill'
            ],
            '/experience/': [
                'utils'
            ]
        },
        // 最后更新时间
        lastUpdated: 'Last Updated',
        // 作者
        author: 'sans',
        markdown: {
            lineNumbers: true
        },
    }
}
