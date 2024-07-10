import React, { useEffect } from 'react';
import { Howl } from 'howler';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { io } from 'socket.io-client';

// Define your sound files
const soundFiles = [
  '/sounds/BuzzLeadA2.wav',
  '/sounds/ClassicSyncA1.wav',
  '/sounds/DirtySweptC4.wav',
  '/sounds/MoogStringC2.wav',
  '/sounds/PhatSweepaFsharp1.wav'
];

// Initialize Socket.IO client
const socket = io('/', {
  path: '/socket.io',
});

function App() {
  // Create Howl instances for each sound file
  const sounds = soundFiles.map(file => new Howl({ src: [file], volume: 1 / 3 }));

  // Function to play a specific sound and emit to server
  const playSound = index => {
    sounds[index].play();
    socket.emit('playSound', index); // Emit to server
    console.log(`Sent playSound event with index ${index} to server`);
  };

  useEffect(() => {
    // Listen for 'playSound' events from the server
    socket.on('playSound', index => {
      sounds[index].play();
      console.log(`Received playSound event from server with index ${index}`);
    });

    // Clean up the effect
    return () => {
      socket.off('playSound');
    };
  }, [sounds]); // Re-listen when sounds array changes (though it shouldn't change)

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" p={2}>
        <h1>Socket Sound Machine</h1>
        {soundFiles.map((file, index) => (
          <Box key={index} m={1}>
            <Button variant="outlined" onClick={() => playSound(index)}>
              {file.split('/').pop()} {/* Display file name */}
            </Button>
          </Box>
        ))}
      </Box>
    </>
  );
}

export default App;
