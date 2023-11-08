import { AxiosRequestConfig } from 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    hideError?: boolean
  }
}

declare global {
  /**
   * 
   */
  interface PageQuery {
    pageNum: number
    pageSize: number
  }

  /**
   * 
   */
  interface PageResult<T> {
    /**
     * 
     */
    list: T
    /**
     * 
     */
    total: number
  }

  /**
   * 
   */
  interface DialogOption {
    /**
     * 
     */
    title?: string
    /**
     * 
     */
    visible: boolean
  }
  /**
   * 
   */
  interface OptionType {
    /**
     * 
     */
    value: string | number
    /**
     * 
     */
    label: string
    /**
     * 
     */
    children?: OptionType[]
  }
}
export {}
