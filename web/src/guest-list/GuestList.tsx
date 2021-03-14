import React, { useEffect, useState } from "react";

interface Guest {
    id: string;
    firstName: string;
    lastName: string;
}

export default function GuestList() {
  const [error, setError] = useState(null as any);
  const [isLoaded, setIsLoaded] = useState(false);
  const [guests, setGuests] = useState({_embedded: {guest: [] as Guest[]}});

  useEffect(() => {
    setTimeout(() => fetch("/guest/")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setGuests(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      ), 1000)
  }, []);

  if (error) {
    return <div>Request failed to retrieve the guest list<br/>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <ul>
        {guests._embedded.guest.map((guest) => (
          <li key={guest.id}>
            {guest.firstName} {guest.lastName}
          </li>
        ))}
      </ul>
    );
  }
}
