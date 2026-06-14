import { useCallback, useState } from "react";
import HomePage from "@/pages/HomePage";
import AppProviders from "@/app/providers/AppProviders";
import AppLayout from "@/layouts/AppLayout/AppLayout";
import ProfileHeader from "@/layouts/ProfileHeader/ProfileHeader";
import type { AppCreateActions } from "@/layouts/ProfileHeader/types";
import ProfileGate from "@/features/profile/components/ProfileGate/ProfileGate";
import { useProfileBets } from "@/features/profile/hooks/useProfileBets";
import PageError from "@/shared/ui/PageError/PageError";
import PageLoader from "@/shared/ui/PageLoader/PageLoader";

const App = () => {
  const profileBets = useProfileBets();
  const [createActions, setCreateActions] = useState<AppCreateActions>({});
  const handleRegisterCreateActions = useCallback((actions: AppCreateActions) => {
    setCreateActions(actions);
  }, []);



  const mainContent = profileBets.loading ? (

    <PageLoader />

  ) : profileBets.error ? (

    <PageError message={profileBets.error} onRetry={profileBets.reload} />

  ) : profileBets.profile ? (

    <HomePage
      profileBets={profileBets}
      onRegisterCreateActions={handleRegisterCreateActions}
    />

  ) : (

    <ProfileGate

      profiles={profileBets.profiles}

      onSelect={profileBets.selectProfile}

      onCreate={profileBets.createProfile}

    />

  );



  return (

    <AppProviders>

      <AppLayout

        headerProfile={

          profileBets.profile ? (

            <ProfileHeader
              profile={profileBets.profile}
              bets={profileBets.bets}
              createActions={createActions}
              onSyncSportsRu={profileBets.syncSportsRuMatches}
              onSetBalance={profileBets.setBalance}

              onUpdateName={profileBets.updateProfileName}

              onDeleteProfile={profileBets.deleteProfile}

              onExitProfile={profileBets.exitProfile}

            />

          ) : null

        }

      >

        {mainContent}

      </AppLayout>

    </AppProviders>

  );

};



export default App;

