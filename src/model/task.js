/* eslint-disable class-methods-use-this */
import _axios, { put, _delete } from '@/lib/plugin/axios'

class Task {
  async createTask(data) {
    return _axios({
      method: 'post',
      url: 'v1/task',
      data,
    })
  }

  async delectTask(id) {
    const res = await _delete(`v1/task/${id}`)
    return res
  }

  async editTask(id, info) {
    const res = await put(`v1/task/${id}`, info)
    return res
  }

  async getTasks() {
    return _axios({
      method: 'get',
      url: 'v1/task',
      handleError: true,
    })
  }

  async getTaskFiles(id) {
    return _axios({
      method: 'get',
      url: `v1/file?task_id=${id}`,
      handleError: true,
    })
  }

  async updateTaskFileInfo(file_id, info) {
    return put(`v1/file/${file_id}`, info)
  }

  async deleteTaskFile(id) {
    return await _delete(`v1/file/${id}`)
  }
}

export default new Task()
