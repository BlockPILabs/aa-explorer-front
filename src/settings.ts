interface DefaultSettings {
  title: string

  fixedHeader: boolean

  sidebarLogo: boolean

  size: string

  language: string
}

const defaultSettings: DefaultSettings = {
  title: 'AA Explorer',
  fixedHeader: false,
  sidebarLogo: true,
  size: 'default', // default |large |small
  language: 'en' // zh-cn| en
}

export default defaultSettings
