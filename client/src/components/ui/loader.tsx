import { MoonLoader } from "react-spinners";


const Loader = () => {
  return (
   <MoonLoader
        color={'#123abc'}
        size={26}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
  )
}

export default Loader