import { useEffect, useState } from "react";
import { Calendar, MapPin, Settings2, } from "lucide-react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

import { Button } from "../../components/button";
import { api } from "../../lib/axios";

interface Trip {
  id: string
  destination: string
  starts_at: string
  ends_at: string
  is_confirmed: boolean
}

export function DestinationAndDateHeader() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState<Trip>()

  useEffect(() => {
    api.get('/trips/' + tripId)
      .then(
        ({ data: { trip } }) => {
          setTrip(trip)
        }
      )
  }, [tripId])

  const displayedDate = trip ?
    format(trip.starts_at, "d' de 'LLL").concat(' até ').concat(format(trip.ends_at, "d' de 'LLL"))
    : null

  return (
    <div className="px-4 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400" />
        <span className="text-lg text-zinc-100">{trip?.destination}</span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-zinc-400" />
          <span className="text-lg text-zinc-100">{displayedDate}</span>
        </div>

        <Button variant="secondary">
          Alterar local/data
          <Settings2 className="size-5" />
        </Button>
      </div>
    </div>
  )
}
