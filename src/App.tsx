import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { TripDetailPage } from "./pages/trip-details"
import { CreateTripPage } from "./pages/create-trip"

const router = createBrowserRouter([
	{
		path: "/",
		element: <CreateTripPage />
	},
	{
		path: "/trips/:tripId",
		element: <TripDetailPage />
	},
])

export function App() {

	return <RouterProvider router={router} />
}
