const RoleComponent = () => {
    const radios = [
        {
            name: "Join as a Farm Owner",
            description: "Create your own farm to manage and track your farm performance and production",
        },
        {
            name: "Join as a Worker",
            description: "If you are a worker of a registered farm click here to join your farm",
        },
       
    ]

    return (
        <div className="max-w-md mx-auto px-4 bg-white rounded-lg shadow-lg py-8 my-10">
            <h2 className="text-gray-800 font-medium">Find a plan to power your projects</h2>
            <ul className="mt-6 space-y-3">
                {
                    radios.map((item, idx) => (
                        <li key={idx}>
                            <label htmlFor={item.name} className="block relative">
                                <input id={item.name} type="radio" defaultChecked={idx == 1 ? true : false} name="payment" className="sr-only peer" />
                                <div className="w-full p-5 cursor-pointer rounded-lg border bg-white shadow-sm ring-indigo-600 peer-checked:ring-2 duration-200">
                                    <div className="pl-7">
                                        <h3 className="leading-none text-gray-800 font-medium">
                                            {item.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                                <span className="block absolute top-5 left-5 border peer-checked:border-[5px] peer-checked:border-indigo-600 w-4 h-4 rounded-full">
                                </span>
                            </label>
                        </li>
                    ))
                }
            </ul>
            <button className="px-6 py-3.5 mt-5 text-white bg-indigo-600 rounded-lg duration-150 hover:bg-indigo-700 active:shadow-lg">
        Button
      </button>
        </div>
    )
}

RoleComponent.displayName = "RoleComponent";

export default RoleComponent;