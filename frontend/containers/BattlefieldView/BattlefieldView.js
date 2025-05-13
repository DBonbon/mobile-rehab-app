import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './BattlefieldView.module.css';

const BattlefieldView = ({ battlefield, currentUser, userPoints }) => {
  const [fighterPosition, setFighterPosition] = useState(null);
  const [pathPositions, setPathPositions] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [fighter, setFighter] = useState(null);
  const [TerrainComponent, setTerrainComponent] = useState(null);
  const [AvatarComponent, setAvatarComponent] = useState(null);

  useEffect(() => {
    // Dynamically load the terrain component based on the terrain identifier
    if (battlefield?.terrain?.identifier) {
      // Dynamic import for terrain components from your component structure
      const TerrainComponentImport = dynamic(
        () => import(`../terrain/${battlefield.terrain.identifier}`),
        { 
          loading: () => <p>Loading terrain...</p>,
          ssr: false
        }
      );
      
      setTerrainComponent(() => TerrainComponentImport);
    }
  }, [battlefield?.terrain?.identifier]);

  useEffect(() => {
    // Dynamically load the fighter avatar component
    if (fighter?.avatar_identifier) {
      // Dynamic import for avatar components from your component structure
      const AvatarComponentImport = dynamic(
        () => import(`../Avatars/${fighter.avatar_identifier}`),
        { 
          loading: () => null,
          ssr: false
        }
      );
      
      setAvatarComponent(() => AvatarComponentImport);
    }
  }, [fighter?.avatar_identifier]);

  useEffect(() => {
    // In a real implementation, this data would come from your API
    if (battlefield && currentUser) {
      // Extract and sort path positions by order
      const positions = battlefield.battlefield_path_positions
        .map(pp => ({
          id: pp.position.id,
          name: pp.position.name,
          description: pp.position.description,
          requiredPoints: pp.position.required_points,
          order: pp.position.order
        }))
        .sort((a, b) => a.order - b.order);
      
      setPathPositions(positions);
      
      // Find fighter for current user
      const userFighter = battlefield.battlefield_fighters.find(
        bf => bf.fighter.user.id === currentUser.id
      );
      
      if (userFighter) {
        setFighter({
          id: userFighter.fighter.id,
          name: userFighter.fighter.name,
          avatarIdentifier: userFighter.fighter.avatar_identifier
        });
      }
      
      // Find current position based on user points
      let currentPos = null;
      for (let i = positions.length - 1; i >= 0; i--) {
        if (userPoints >= positions[i].requiredPoints) {
          currentPos = positions[i];
          break;
        }
      }
      
      // If no position matches, use the first position
      if (!currentPos && positions.length > 0) {
        currentPos = positions[0];
      }
      
      setCurrentPosition(currentPos);
    }
  }, [battlefield, currentUser, userPoints]);

  // If terrain component isn't loaded yet, show loading state
  if (!TerrainComponent) {
    return <div className={styles.loading}>Loading battlefield...</div>;
  }

  return (
    <div className={styles.battlefieldContainer}>
      <h2 className={styles.battlefieldTitle}>{battlefield?.title}</h2>
      
      {/* Render the dynamically loaded terrain component */}
      <TerrainComponent 
        pathPositions={pathPositions}
        currentPosition={currentPosition}
        userPoints={userPoints}
        fighter={fighter}
        AvatarComponent={AvatarComponent}
      />
      
      {/* Display current position details */}
      {currentPosition && (
        <div className={styles.currentPositionInfo}>
          <h3>Current Position: {currentPosition.name}</h3>
          <p>{currentPosition.description}</p>
          <p>Points: {userPoints} / {pathPositions[pathPositions.length - 1]?.requiredPoints || 0}</p>
        </div>
      )}
    </div>
  );
};

export default BattlefieldView;