import React, { useEffect, useState } from "react";

interface Guest {
    id: string;
    firstName: string;
    lastName: string;
}

interface GuestResponse {
  _embedded: {
    guest: Guest[]
  }
}

export default function GuestList() {
  const [error, setError] = useState(null as any);
  const [isLoaded, setIsLoaded] = useState(false);
  const [guests, setGuests] = useState({_embedded: {guest: [] as Guest[]}});

  useEffect(() => {
    fetch("/guest/")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setGuests(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
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
