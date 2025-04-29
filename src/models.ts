export interface IProject {
  _id: string
  title: string
  desc: string
}

export interface ITask {
  _id: string
  projectId: string
  name: string
  date: Date
  priority: 'high' | 'middle' | 'low'
  isCompleted: boolean
}
