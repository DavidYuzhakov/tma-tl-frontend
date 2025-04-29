import { useNavigate } from 'react-router'
import { useState } from 'react'
import { isAxiosError } from 'axios'
import apiInstance from '../axios'
import { IProject } from '../models'

interface IProjectCardProps {
  desc: string
  title: string
  _id: string
  setProjects: React.Dispatch<React.SetStateAction<IProject[]>>
}

export function ProjectCard({
  desc,
  title,
  _id,
  setProjects,
}: IProjectCardProps) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const clickHandler = () => {
    navigate(`/project/${_id}`)
  }

  const deleteHandler = async () => {
    if (window.confirm('Do you want to delete project?'))
      try {
        setLoading(true)
        await apiInstance.delete(`/projects/${_id}`)
        setProjects((prev) => prev.filter((project) => project._id !== _id))
      } catch (err) {
        console.log(err)
        if (isAxiosError(err)) {
          alert(err.response?.data.message ?? err.message)
        }
      } finally {
        setLoading(false)
      }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="border border-gray-500 px-2 py-3 pb-5 rounded-xl h-[175px]  relative">
      <div
        className="cursor-pointer h-full flex flex-col"
        onClick={clickHandler}
      >
        <h4 className="font-bold text-center text-xl text-green-600">
          {title}
        </h4>
        <p className="text-black/70 text-sm grow">{desc}</p>
      </div>
      <div
        onClick={deleteHandler}
        className="bg-red-400 absolute bottom-0 left-0 w-full flex items-center justify-center py-1 rounded-b-xl"
      >
        <img width={20} src="/delete.svg" alt="delete" />
      </div>
    </div>
  )
}
