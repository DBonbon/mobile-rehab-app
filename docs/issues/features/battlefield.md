Feature Template
Session Info

Related PRs: N/A
Epic: #battlefield-visualization
Context

Implementation of a visual battlefield progress tracker for the rehabilitation app. This feature creates a graphical representation of a user's progress as they complete rehabilitation exercises, with the fighter avatar advancing along a path through different terrains as points are earned.
Requirements

    Create a battlefield visualization component that renders different terrains
    Implement a path with positions that represent progress milestones
    Show the user's fighter avatar at their current position based on points
    Support dynamic loading of different terrain types and avatars
    Integrate with the existing achievement and task completion system

Technical Notes

    The implementation uses CSS-based terrain visualization instead of SVG for better cross-browser compatibility
    Proper z-indexing ensures elements are layered correctly (sky → mountain → path → avatar)
    Dynamic imports load terrain components based on the identifier in the API response
    Position interpolation handles variable numbers of path positions
    Components are structured to follow the existing project architecture:
        /containers/BattlefieldPage/
        /components/Terrain/Mountain/
        /components/Avatars/TriangleAvatar/

Key implementation details:

    BattlefieldPage container receives data from the API and dynamically loads the appropriate terrain component
    Terrain components (like Mountain) handle the visual rendering and positioning of path elements
    Avatar components represent the user's fighter
    CSS handles terrain visualization while SVG is used for paths and markers

Acceptance Criteria

    BattlefieldPage loads and displays the correct terrain based on API data
    Path positions are correctly displayed along a visual path
    Fighter avatar appears at the current position based on user points
    Position names and descriptions are visible along the path
    Completed positions are visually distinguished from uncompleted ones
    Fighter moves to new positions as user earns points
    Multiple terrains can be implemented using the same pattern

Dependencies

    Wagtail backend API providing battlefield data structure
    Exercise and Achievement models to track progress
    Task completion system to award points

References

    Mountain Terrain Component
    Triangle Avatar Component
    BattlefieldPage Container

Tags

feature, visualization, gamification, rehabilitation, progress-tracking