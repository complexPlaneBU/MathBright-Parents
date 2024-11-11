const appState = {
    gActiveWeek: 'this_week',
    gActiveTab: 'rank-tab',
    gRankSearchActive: false,
    gSearchedUsername: 'none',
    //Rewards
    gRewardsCards: 0, //list of all the bonus and standard parent rewards that can be offered
    gRewardsParentDataForUser: 0, // the reward logs for parent rewards
    gRewardsBonusDataForUser: 0, // the reward logs for parent rewards
    gRewardsActiveTab: 'bonus',
    gRewardsBonusAvailable: 0,
    gRewardsBonusInCart: 0,
    gRewardsParentAvailable: 0,
    gRewardsParentInCart: 0,
    //Leaderboard
    gLeaderBoardData: 0,
    gLeaderBoardStatsForUser: 0,
    // User Logged in
    gLoggedIn: 0,
    gLoggedInUsername: 0,
    gLoggedInUserStats: 0,
   // current week
    gCurrentWeek: 1728288000,  // TODO: update from database
    // config related
    gNumUsersForLeaderBoard: 99 // TODO: pull this data from the server to use on client, making sure the server validates any requests against it's own copy

};

export default appState;
