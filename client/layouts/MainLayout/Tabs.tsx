import React, { useEffect, useState } from 'react';
import TabProfile from '@/components/Tabs/TabProfile';
import { useRouter } from 'next/router';
import TabChat from '@/components/Tabs/TabChat';
import TabGroup from '@/components/Tabs/TabGroup';
import TabContact from '@/components/Tabs/TabContact';

interface ITabs {

}

const Tabs: React.FC<ITabs> = () => {
  const router = useRouter();
  const { query: { tab } } = router;
  const [tabActive, setTabActive] = useState(1);
  
  useEffect(() => {
    switch (tab) {
      case 'profile':
        setTabActive(1);
        break;
      case 'chat':
        setTabActive(2);
        break;
      case 'group':
        setTabActive(3);
        break;
      case 'contact':
        setTabActive(4);
        break;
      default:
        setTabActive(1);
        break;
    }
  }, [tab]);
  
  
  return < >
    {tabActive === 1 && <TabProfile />}
    {tabActive === 2 && <TabChat />}
    {tabActive === 3 && <TabGroup />}
    {tabActive === 4 && <TabContact />}
  </>;
};

export default Tabs;