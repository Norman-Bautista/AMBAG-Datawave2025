import { 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Avatar,
  Typography
} from '@mui/material'

import { useState, useEffect } from 'react';

const ContributionDiv = ({ members = [], loading = false, error = null }) => {

  const [contributionsList, setContributionsList] = useState([]);

  useEffect(() => {
    if (members && members.length > 0) {
      console.log("📊 ContributionDiv: Received members from props:", members);
      
      // Filter out manager and format members
      const nonManagerMembers = members.filter(m => m.role !== 'manager');
      console.log("📊 ContributionDiv: Filtered non-manager members:", nonManagerMembers);
      
      // Map to display format
      const formatted = nonManagerMembers.map(m => ({
        first_name: m.first_name,
        last_name: m.last_name,
        name: m.first_name && m.last_name ? `${m.first_name} ${m.last_name}` : m.firebase_uid,
        role: 'Member',
        amount: '+ 2,500.00 PHP', // Replace with actual amount if available
        date: new Date().toLocaleDateString(), // Replace with actual date if available
      }));
      
      console.log("📝 ContributionDiv: Formatted contributions list:", formatted);
      setContributionsList(formatted);
    } else {
      console.log("📊 ContributionDiv: No members received or empty array");
      setContributionsList([]);
    }
  }, [members]);

 //MUI Functions for Automatic Avatar Coloring!!!
  function stringToColor(string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };


  function stringAvatar(first_name, last_name) {
    const name = first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || '?';
    const first = first_name?.[0] || '?';
    const second = last_name?.[0] || '';
    return {
      sx: { bgcolor: stringToColor(name) },
      children: `${first}${second}`,
    };
  }

  return (
    <div className="max-h-[600px] overflow-y-auto pr-2 flex flex-col gap-4 mt-7 outline-1 outline-gray-200 rounded-2xl shadow-md lg:outline-0 lg:rounded-none lg:shadow-none">
      <h1 className="flex justify-center sm:mt-4 md:text-sm font-bold text-primary">
            Group Contribution Status
          </h1>
      
        {loading ? (
            <Typography variant="body2" className="flex justify-center sm:mt-4 md:text-md font-bold text-gray-600">
              Loading contributions...
            </Typography>
          ) : error ? (
            <Typography variant="body2" className="flex justify-center sm:mt-4 md:text-md font-bold text-red-600">
              Error: {error}
            </Typography>
          ) : contributionsList.length === 0 ? (
            <Typography variant="body2" className="flex justify-center sm:mt-4 md:text-md font-bold text-gray-600">
              No member contributions yet.
            </Typography>
          ) : (

            <List>
              {contributionsList.map((contributions, index)=>(
                <div key = {index}>
                  <ListItem>
                    <ListItemText>
                      <div className="flex items-center justify-around md:justify-between ">
                        {/* Avatar + Info block */}
                          <div className="flex items-center gap-3">
                            <Avatar {...stringAvatar(contributions.first_name, contributions.last_name)} />
                            <div className="flex flex-col">
                              <p className="text-sm sm:text-base md:text-sm font-semibold">
                                {contributions.first_name} {contributions.last_name}
                              </p>
                              <p className="text-xs sm:text-sm md:text-xxs text-green font-light">
                                Contributed
                              </p>
                              <p className="text-xs sm:text-sm md:text-xxs font-light">
                                {contributions.role}
                              </p>
                            </div>
                          </div>

                          {/* Amount + Date block (kept on the right side) */}
                          <div className="flex flex-col gap-1 text-right">
                            <p className="text-sm sm:text-base md:text-xs font-semibold text-green">
                              {contributions.amount}
                            </p>
                            <p className="text-xxs sm:text-xs md:text-xxs font-light">
                              {contributions.date}
                            </p>
                        </div>
                      </div>
                    </ListItemText>
                  </ListItem>
                  {index < contributionsList.length - 1 && (<Divider variant='middle' component="li"/>) }
                </div>
              ))}
            </List>
          )}
    </div>
  )
}
export default ContributionDiv