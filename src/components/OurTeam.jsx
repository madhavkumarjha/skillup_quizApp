import UserCard from "./cards/UserCard"


export default function OurTeam({data}) {

  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
        <div className="">
          <h2 className="text-3xl font-semibold tracking-tight text-pretty text-white sm:text-4xl">
            Our Teaching Team
          </h2>
          <p className="mt-6 text-lg/8 text-gray-400">
            Passionate mentors who bring real‑world experience into every lesson, helping you learn faster and smarter.
          </p>
        </div>
        <ul role="list" className="grid gap-x-8 items-center  gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
          {data?.map((person) => (
            <li key={person.name}>
              <UserCard person={person}/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
