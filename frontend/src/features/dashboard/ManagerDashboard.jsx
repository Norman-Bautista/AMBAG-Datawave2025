import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { api, listGoals } from "../../lib/api";
import ManagerBalanceCard from "../manager/components/ManagerBalanceCard";
import useIsMobile from "../../hooks/useIsMobile";
import { useAuthRole } from "../../contexts/AuthRoleContext";

import ConsistencyStat from "./ConsistencyStat";
import ContributionDiv from "./ContributionDiv";
import DashboardBtns from "./DashboardBtns";
import GoalCards from "../goals/GoalCards";
import GoalCarouselMobile from "../goals/GoalCarouselMobile";
import MemberHeader from "../members/MemberHeader";
import ActionButtons from "./ActionButtons";
import {
  Add as AddIcon,
} from '@mui/icons-material';
import CreateGoalModal from "../goals/CreateGoalModal";
import CreateGroupModal from "../groups/CreateGroupModal";
import SplitBill from "../manager/SplitBill";

const ManagerDashboard = ({ onLoan }) => {
  const isMobile = useIsMobile();
  const [firstName, setFirstName] = useState("");
  const [goals, setGoals] = useState([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [groupLoading, setGroupLoading] = useState(true);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const { user } = useAuthRole();
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);


  // Fetch user first name
  useEffect(() => {
    const fetchFirstName = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      const token = await currentUser.getIdToken();
      const res = await api.get(`/users/profile/${currentUser.uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFirstName(res?.data?.profile?.first_name || "Manager");
    };
    fetchFirstName();
  }, []);

  // Fetch goals
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setGoalsLoading(true);
        const data = await listGoals();
        setGoals(data || []);
      } catch (err) {
        console.error("Error fetching goals:", err);
        setGoals([]);
      } finally {
        setGoalsLoading(false);
      }
    };
    fetchGoals();
  }, []);

  // Fetch group
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setGroupLoading(true);
        const token = await getAuth().currentUser.getIdToken();
        const res = await api.get(`/groups/my-group`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroup(res?.data || null);
      } catch (err) {
        console.error("Error fetching group:", err);
        setGroup(null);
      } finally {
        setGroupLoading(false);
      }
    };
    fetchGroup();
  }, []);

  // Map goals
  const mappedGoals = goals
    .map((g) => ({
      ...g,
      amount: g.current_amount ?? 0,
      total: g.goal_amount ?? 0,
      targetDate: g.target_date,
    }))
    .slice(0, 6);

  // Determine if user has data (dynamic)
  const hasGoals = goals.length > 0;
  const hasGroup = group !== null;
  const hasData = !goalsLoading && !groupLoading && (hasGoals || hasGroup);

  const handleOpenSplitBill = (member) => {
    setSelectedMember(member || null); // optional, if you want to open for specific member
    setIsSplitBillOpen(true);
  };

  const handleCloseSplitBill = () => {
    setIsSplitBillOpen(false);
    setSelectedMember(null);
  };

  const handleSaveQuota = (quota) => {
    console.log("Quota saved:", quota);
    // TODO: update backend / state with new quota
    handleCloseSplitBill();
  };


  // ---------- Mobile Layout ----------
  if (isMobile) {
    return (
      <main className="flex flex-col min-h-screen bg-white mb-16">
        <div className="bg-primary text-white px-4 pb-4 rounded-b-3xl">
          <div className="my-4">
            <MemberHeader userName={firstName || "Manager"} />
          </div>
          {/* Manager Balance Card - mobile style */}
          <ManagerBalanceCard />
          {hasData ? (
            <div className="p-4">
              <GoalCarouselMobile goals={mappedGoals} loading={goalsLoading} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-8 bg-shadow rounded-xl px-6 py-12 shadow-md mb-4">
              <p className="text-secondary text-center text-sm sm:text-base md:text-lg">
                Goals are Empty
              </p>
              <button
                className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-xs sm:text-sm md:text-base px-4 py-2 rounded-xl cursor-pointer"
                onClick={() => setIsGoalModalOpen(true)}
              >
                <AddIcon className="text-white text-sm sm:text-base" />
                <span>Create a Goal</span>
              </button>
            </div>
          )}
        </div>
        <div className="p-4">
          <ActionButtons onLoan={onLoan} />
        </div>
        {!hasData && (
          <div className="p-32 mx-4 mt-6 rounded-2xl outline-1 outline-gray-200 shadow-md bg-white flex flex-col items-center justify-center gap-6">
            <p className="text-textcolor text-center text-sm sm:text-base md:text-lg">
              You are not in a group yet
            </p>
            <button
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-textcolor text-xs sm:text-sm md:text-base px-3 py-2 rounded-xl cursor-pointer"
              onClick={() => setIsGroupModalOpen(true)}
            >
              <AddIcon className="text-textcolor text-sm sm:text-base" />
              <span>Create a Group</span>
            </button>
          </div>
        )}
        {hasData && (
          <>
            <div className="p-4">
              <ContributionDiv />
            </div>
          </>
        )}
        <div className="p-4 bg-white rounded-2xl shadow-sm h-40 flex items-center justify-center">
          {hasData ? <ConsistencyStat /> : null}
        </div>
        {isGroupModalOpen && (
          <CreateGroupModal
            isOpen={isGroupModalOpen}
            onClose={() => setIsGroupModalOpen(false)}
          />
        )}
        {isGoalModalOpen && (
          <CreateGoalModal
            open={isGoalModalOpen}
            onClose={() => setIsGoalModalOpen(false)}
            onCreateGoal={() => {}}
          />
        )}
        {/* Quota Modal */}
        <SplitBill
          open={isSplitBillOpen}
          member={selectedMember}
          onClose={handleCloseSplitBill}
          onSave={handleSaveQuota}
        />
      </main>
    );
  }

  // ---------- Desktop Layout ----------
  return (
    <main className="flex flex-col w-full h-full min-h-screen justify-center">
      <div className="bg-primary w-full max-w-6xl mx-auto rounded-4xl grid grid-cols-1 md:grid-cols-3 gap-4 p-4 auto-rows-min">
        {/* Left Column */}
        {!hasData ? (
          <div className="bg-shadow rounded-2xl p-4 col-span-1 flex items-center justify-center">
            <button
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-textcolor text-xs sm:text-sm md:text-base px-3 py-2 rounded-xl cursor-pointer"
              onClick={() => setIsGroupModalOpen(true)}
            >
              <AddIcon className="text-textcolor text-sm sm:text-base" />
              <span>Create a Group</span>
            </button>
          </div>
        ) : (
          <div className="bg-secondary rounded-2xl p-4">
            <ContributionDiv />
          </div>
        )}
        {/* Top Right Boxes - ManagerBalanceCard above GoalCards */}
        <div className={`col-span-2 ${hasData ? "bg-secondary" : "bg-shadow"} rounded-2xl p-4 h-120 flex flex-col items-center justify-start`}>
          <ManagerBalanceCard />
          {!hasData ? (
            <button
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-xs sm:text-sm md:text-base px-4 py-2 rounded-xl cursor-pointer"
              onClick={() => setIsGoalModalOpen(true)}
            >
              <AddIcon className="text-white text-sm sm:text-base" />
              <span>Create a Goal</span>
            </button>
          ) : (
            <GoalCards goals={mappedGoals} />
          )}
        </div>
       {/* Bottom Left */}
      <div className="bg-white rounded-2xl p-4  shadow-sm flex items-center justify-center">
        {hasData ? <ConsistencyStat /> : null}
      </div>
        {/* Bottom Right */}
        <div className="col-span-2 row-span-3 bg-secondary rounded-2xl p-4">
          <DashboardBtns onLoan={onLoan}  onSplitBill={handleOpenSplitBill}/>
        </div>
      </div>
      {isGroupModalOpen && (
        <CreateGroupModal
          isOpen={isGroupModalOpen}
          onClose={() => setIsGroupModalOpen(false)}
        />
      )}
      {isGoalModalOpen && (
        <CreateGoalModal
          open={isGoalModalOpen}
          onClose={() => setIsGoalModalOpen(false)}
          onCreateGoal={() => {}}
        />
      )}
      {/* Quota Modal */}
      <SplitBill
        open={isSplitBillOpen}
        member={selectedMember}
        onClose={handleCloseSplitBill}
        onSave={handleSaveQuota}
      />
    </main>
  );
};

export default ManagerDashboard;
