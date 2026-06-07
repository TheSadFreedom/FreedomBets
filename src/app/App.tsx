import HomePage from "@/pages/HomePage";

import AppProviders from "@/app/providers/AppProviders";

import AppLayout from "@/layouts/AppLayout/AppLayout";

import ProfileHeader from "@/layouts/ProfileHeader/ProfileHeader";

import ProfileGate from "@/features/profile/components/ProfileGate/ProfileGate";

import { useProfileBets } from "@/features/profile/hooks/useProfileBets";

import PageError from "@/shared/ui/PageError/PageError";

import PageLoader from "@/shared/ui/PageLoader/PageLoader";



const App = () => {

  const profileBets = useProfileBets();



  const mainContent = profileBets.loading ? (

    <PageLoader />

  ) : profileBets.error ? (

    <PageError message={profileBets.error} onRetry={profileBets.reload} />

  ) : profileBets.profile ? (

    <HomePage profileBets={profileBets} />

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

