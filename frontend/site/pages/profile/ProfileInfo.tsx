const ProfileInfo: React.FC<{ name: string, info: string}> = ({ name, info }) => {
  return (
    <div className="flex flex-row items-center space-x-4 py-4">
      <span className="text-lg font-medium text-accent-600 flex-1">
        {name}
      </span>
      <span>
        {info}
      </span>
    </div>
  )
}

export default ProfileInfo
