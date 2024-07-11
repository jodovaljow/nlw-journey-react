import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-day-picker";

import { InviteGuestModal } from "./invite-guests-modal";
import { ConfirmTripModal } from "./confirm-trip-modal";
import { DestinationAndDateStep } from "./steps/destination-and-date-step";
import { InviteGuestsStep } from "./steps/invite-guests-step";
import { api } from "../../lib/axios";


export function CreateTripPage() {
  const navigate = useNavigate()

  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false)
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false)

  const [destination, setDestination] = useState<string>()
  const [ownerName, setOwnerName] = useState<string>()
  const [ownerEmail, setOwnerEmail] = useState<string>()
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange>();
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])

  function openGuestsInput() {
    setIsGuestsInputOpen(true)
  }

  function closeGuestsInput() {
    setIsGuestsInputOpen(false)
  }

  function openGuestsModal() {
    setIsGuestsModalOpen(true)
  }

  function closeGuestsModal() {
    setIsGuestsModalOpen(false)
  }

  function openConfirmTripModal() {
    setIsConfirmTripModalOpen(true)
  }

  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false)
  }

  async function createTrip(event: FormEvent) {

    event.preventDefault()

    if (!destination)
      return
    if (!ownerName)
      return
    if (!ownerEmail)
      return
    if (!eventStartAndEndDates)
      return
    if (!eventStartAndEndDates.from)
      return
    if (!eventStartAndEndDates.to)
      return

    const { data: { tripId } } = await api.post('/trips', {
      destination,
      starts_at: eventStartAndEndDates.from,
      ends_at: eventStartAndEndDates.to,
      owner_name: ownerName,
      owner_email: ownerEmail,
      emails_to_invite: emailsToInvite,
    })

    navigate("/trips/" + tripId)
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get("email")?.toString()

    if (!email)
      return

    if (emailsToInvite.includes(email))
      return

    setEmailsToInvite([
      ...emailsToInvite,
      email,
    ])

    event.currentTarget.reset()
  }

  function removeNewEmailToInvite(emailToRemove: string) {
    const newEmailList = emailsToInvite.filter(email => email !== emailToRemove)

    setEmailsToInvite(newEmailList)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">

        <div className="flex flex-col items-center gap-3">

          <img src="/logo.svg" alt="plann.er" />
          <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>

        <div>
          <DestinationAndDateStep
            closeGuestsInput={closeGuestsInput}
            isGuestsInputOpen={isGuestsInputOpen}
            openGuestsInput={openGuestsInput}
            eventStartAndEndDates={eventStartAndEndDates}
            setEventStartAndEndDates={setEventStartAndEndDates}
            setDestination={setDestination}
          />
        </div>

        {isGuestsInputOpen &&
          <InviteGuestsStep
            emailsToInvite={emailsToInvite}
            openConfirmTripModal={openConfirmTripModal}
            openGuestsModal={openGuestsModal} />
        }

        <p className="text-sm text-zinc-500">
          Ao planejar sua viagem pela plann.er você automaticamente concorda <br />
          com nossos <a className="text-zinc-300 underline" href="#">termos de uso</a> e <a className="text-zinc-300 underline" href="#">políticas de privacidade</a>.
        </p>
      </div>

      {isGuestsModalOpen &&
        <InviteGuestModal closeGuestsModal={closeGuestsModal} emailsToInvite={emailsToInvite} removeNewEmailToInvite={removeNewEmailToInvite} addNewEmailToInvite={addNewEmailToInvite} />
      }

      {
        isConfirmTripModalOpen &&

        <ConfirmTripModal closeConfirmTripModal={closeConfirmTripModal} createTrip={createTrip} setOwnerEmail={setOwnerEmail} setOwnerName={setOwnerName} />
      }

    </div>
  );
}
