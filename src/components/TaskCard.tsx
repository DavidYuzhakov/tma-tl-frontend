/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import { ITask } from '../models'
import apiInstance from '../axios'
import { isAxiosError } from 'axios'
import { SubmitHandler, useForm } from 'react-hook-form'

interface ITaskCardProps {
  _id: string
  name: string
  isCompleted: boolean
  date: string
  time: string
  priority: 'high' | 'middle' | 'low'
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>
}

interface IFormValues {
  name: string
  date: string
  priority: 'high' | 'middle' | 'low'
  time: string
}

export function TaskCard({
  _id,
  name,
  isCompleted,
  date,
  priority,
  time,
  setTasks,
}: ITaskCardProps) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editedPriority, setEditedPriority] = useState<
    'high' | 'middle' | 'low'
  >(priority)
  const [editedIsCompleted, setEditedIsCompleted] = useState(isCompleted)

  const isFirstRender = useRef(true)
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IFormValues>({
    values: { date, name, priority, time },
    mode: 'onBlur',
  })

  const updateTask = async (updatedFields: Partial<ITask>) => {
    try {
      setLoading(true)
      await apiInstance.patch(`/tasks/${_id}`, updatedFields)
      setTasks((prev) =>
        prev.map((task) =>
          task._id === _id ? { ...task, ...updatedFields } : task
        )
      )
    } catch (err) {
      console.error(err)
      if (isAxiosError(err)) {
        alert(
          err.response?.data[0]?.msg ??
            err.response?.data?.message ??
            err.message
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const submitHandler: SubmitHandler<IFormValues> = async (data) => {
    setIsOpen(false)
    await updateTask(data)
    reset()
  }

  const handleDelete = async () => {
    if (!window.confirm('Do you want to delete task?')) return
    try {
      setLoading(true)
      console.log(_id)
      await apiInstance.delete(`/tasks/${_id}`)
      setTasks((prev) => prev.filter((task) => task._id !== _id))
    } catch (err) {
      console.error(err)
      if (isAxiosError(err)) {
        alert(err.response?.data?.message ?? err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    updateTask({ isCompleted: editedIsCompleted })
  }, [editedIsCompleted])

  if (loading) {
    return <p className="text-center">Loading...</p>
  }

  return (
    <div className="relative">
      <div className="border-2 rounded-md py-3 px-2 pb-10 border-green-600 cursor-pointer">
        <div className="flex justify-between items-center gap-1">
          <span>{name}</span>
          <svg
            onClick={() => setEditedIsCompleted((prev) => !prev)}
            className={`min-w-6 h-6 ${
              editedIsCompleted ? 'text-white' : 'text-green-600'
            } stroke-current`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              fill={editedIsCompleted ? '#00a63e' : ''}
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8.5 12.5L10.5 14.5L15.5 9.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="mt-2 text-sm text-gray-600">
          <p>
            Priority: <span className="font-medium">{priority}</span>
          </p>
          <p>
            Date:{' '}
            <span className="font-medium">
              {new Date(date).toLocaleDateString()}
            </span>
          </p>
          <p>
            Time: <span className="font-medium">{time}</span>
          </p>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="bg-white p-6 rounded-lg w-full max-w-md flex flex-col gap-4"
          >
            <h2 className="text-lg font-semibold">Edit Task</h2>

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
              className="border p-2 rounded outline-green-600"
              placeholder="Task name"
            />

            <select
              {...register('priority')}
              className="border p-2 rounded outline-green-600"
              value={editedPriority}
              onChange={(e) =>
                setEditedPriority(e.target.value as 'high' | 'middle' | 'low')
              }
            >
              <option value="low">Low</option>
              <option value="middle">Middle</option>
              <option value="high">High</option>
            </select>

            <input
              {...register('date')}
              className="border p-2 rounded outline-green-600"
              type="date"
            />

            <input
              {...register('time')}
              className="border p-2 rounded outline-green-600 "
              type="time"
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

      <div className="absolute bottom-0 left-0 w-full h-[30px] flex items-center justify-between rounded-b-md">
        <span
          onClick={handleDelete}
          className="bg-red-400 w-1/2 rounded-bl-md py-1 flex justify-center h-full cursor-pointer"
        >
          <img width={20} src="/delete.svg" alt="delete" />
        </span>
        <span
          onClick={() => setIsOpen(true)}
          className="bg-amber-400 w-1/2 rounded-br-md py-1 flex justify-center h-full cursor-pointer"
        >
          <img width={20} src="/edit.svg" alt="edit" />
        </span>
      </div>
    </div>
  )
}
