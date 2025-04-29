import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ITask } from '../models'
import { isAxiosError } from 'axios'
import apiInstance from '../axios'
import { TaskCard } from '../components/TaskCard'
import { Plus } from '../components/Plus'
import { SubmitHandler, useForm } from 'react-hook-form'

interface IFormValues {
  name: string
}

export function ProjectPage() {
  const [tasks, setTasks] = useState<ITask[]>([])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>({ values: { name: '' } })
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { id } = useParams()

  useEffect(() => {
    async function getTasks() {
      try {
        const { data } = await apiInstance<{ tasks: ITask[] }>(`/tasks/${id}`)
        setTasks(data.tasks)
      } catch (err) {
        console.log(err)
        if (isAxiosError(err)) {
          alert(err.response?.data.message ?? err.message)
        }
      } finally {
        setLoading(false)
      }
    }
    getTasks()
  }, [id])

  if (loading) {
    return <p className="text-center">Loading... Try again later please</p>
  }

  const createTask: SubmitHandler<IFormValues> = async ({ name }) => {
    try {
      setLoading(true)
      setIsOpen(true)
      const { data } = await apiInstance.post<{ task: ITask }>(`/tasks/${id}`, {
        name,
      })
      setTasks((prev) => [...prev, data.task])
    } catch (err) {
      console.log(err)
      if (isAxiosError(err)) {
        console.log(err)
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
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskCard key={task._id} setTasks={setTasks} {...task} />
        ))
      ) : (
        <p className="text-center">There are no tasks, add at least one</p>
      )}

      <Plus handler={() => setIsOpen(true)} />
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <form
            onSubmit={handleSubmit(createTask)}
            className="bg-white p-6 rounded-lg w-full flex flex-col gap-4"
          >
            <h2 className="text-lg font-semibold">Add task</h2>

            {errors?.name && (
              <p className="text-red-400">
                {errors.name.message ?? 'Invalid name'}
              </p>
            )}
            <input
              {...register('name', {
                required: 'The field must be is required!',
                minLength: {
                  value: 2,
                  message: 'min 2 characters',
                },
                maxLength: {
                  value: 30,
                  message: 'max 30 characters',
                },
              })}
              className="border p-2 rounded"
              placeholder="Task name"
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
    </div>
  )
}
