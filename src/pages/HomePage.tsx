import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import apiInstance from '../axios'
import { IProject } from '../models'
import { ProjectCard } from '../components/ProjectCard'
import { Plus } from '../components/Plus'
import { SubmitHandler, useForm } from 'react-hook-form'

interface IFormValues {
  title: string
  desc: string
}

export function HomePage() {
  const [loading, setLoading] = useState<boolean>(false)
  const [projects, setProjects] = useState<IProject[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>({ values: { title: '', desc: '' } })

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

  const createProject: SubmitHandler<IFormValues> = async ({ title, desc }) => {
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
        <div className="grid grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              {...project}
              setProjects={setProjects}
            />
          ))}
        </div>
      ) : (
        <p className="text-center">There are no projects, add at least one</p>
      )}
      <Plus handler={openModal} />

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <form
            onSubmit={handleSubmit(createProject)}
            className="bg-white p-6 rounded-lg w-full flex flex-col gap-4"
          >
            <h2 className="text-lg font-semibold">Add project</h2>

            {errors?.title && (
              <p className="text-red-400">
                {errors.title.message ?? 'Invalid title'}
              </p>
            )}
            <input
              {...register('title', {
                required: 'The field must be is required!',
                minLength: {
                  value: 1,
                  message: 'min 1 characters',
                },
                maxLength: {
                  value: 10,
                  message: 'max 10 characters',
                },
              })}
              className="border p-2 rounded outline-green-600"
              placeholder="Project title"
            />

            {errors?.desc && (
              <p className="text-red-400">
                {errors.desc.message ?? 'Invalid description'}
              </p>
            )}
            <textarea
              {...register('desc', {
                required: 'The field must be is required!',
                minLength: {
                  value: 10,
                  message: 'min 10 characters',
                },
                maxLength: {
                  value: 100,
                  message: 'max 100 characters',
                },
              })}
              className="border p-2 rounded outline-green-600 resize-none h-[100px]"
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
