/* eslint-disable class-methods-use-this */
import _axios, { put, _delete } from '@/lib/plugin/axios'

class Category {
  async createCategory(data) {
    return _axios({
      method: 'post',
      url: 'v1/category',
      data,
    })
  }

  async delectCategory(id) {
    const res = await _delete(`v1/category/${id}`)
    return res
  }

  async editCategory(id, info) {
    const res = await put(`v1/category/${id}`, info)
    return res
  }

  async getCategorys() {
    return _axios({
      method: 'get',
      url: 'v1/category',
      handleError: true,
    })
  }
}

export default new Category()
