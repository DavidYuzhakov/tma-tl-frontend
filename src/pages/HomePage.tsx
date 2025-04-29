import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import apiInstance from '../axios'
import { IProject } from '../models'
import { ProjectCard } from '../components/ProjectCard'
import { Plus } from '../components/Plus'

export function HomePage() {
  const [loading, setLoading] = useState<boolean>(false)
  const [projects, setProjects] = useState<IProject[]>([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    async function getProjects() {
      try {
        setLoading(true)
        const { data } = await apiInstance.get<{ projects: IProject[] }>(
          '/projects'
        )
        setProjects(data.projects)
      } catch (err) {
        console.log(err)
        if (isAxiosError(err)) {
          alert(err.response?.data.message ?? err.message)
        }
      } finally {
        setLoading(false)
      }
    }
    getProjects()
  }, [])

  if (loading) {
    return <p className="text-center">Loading... Try again later </p>
  }

  const createProject = async () => {
    if (title.length > 0 && desc.length > 0) {
      try {
        setLoading(true)
        setIsOpen(true)
        const { data } = await apiInstance.post<{ project: IProject }>(
          '/projects',
          {
            title,
            desc,
          }
        )
        setProjects((prev) => [...prev, data.project])
      } catch (err) {
        console.log(err)
        if (isAxiosError(err)) {
          alert(
            err.response?.data[0]?.msg ??
              err.response?.data?.message ??
              err.message
          )
        }
      } finally {
        setLoading(false)
        setIsOpen(false)
      }
    } else {
      alert('Fill in the appropriate fields')
    }
  }

  const openModal = () => setIsOpen(true)

  return (
    <>
      {projects.length > 0 ? (
        projects.map((project) => (
          <div className="grid grid-cols-2 gap-4">
            <ProjectCard
              key={project._id}
              {...project}
              setProjects={setProjects}
            />
          </div>
        ))
      ) : (
        <p className="text-center">There are no projects, add at least one</p>
      )}
      <Plus handler={openModal} />

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <form className="bg-white p-6 rounded-lg w-full flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Add project</h2>

            <input
              required
              className="border p-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
            />

            <textarea
              required
              className="border p-2 rounded outline-none resize-none h-[100px]"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Project escription"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={createProject}
                className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
