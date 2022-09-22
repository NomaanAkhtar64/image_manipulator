import { Routes, Route, useLocation } from 'react-router-dom';
import Menu from './component/Menu';
import ResizePage from './page/Resize';
import { conditionalStyle } from './utils';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import CropPage from './page/Crop';
import SlicePage from './page/Slice';
import ColorPage from './page/Color';
function App() {
  const location = useLocation();
  const [parent] = useAutoAnimate<HTMLDivElement>({
    duration: 300,
    easing: 'ease-out',
  });

  return (
    <div
      className={conditionalStyle(
        'flex dark:bg-zinc-900 ',
        location.pathname === '/',
        'justify-center',
        'flex-col-reverse  lg:flex-row'
      )}
      ref={parent}
      style={{ height: '100vh' }}
    >
      <Menu />
      <Routes>
        <Route path='' element={<></>} />
        <Route path='/resize' element={<ResizePage />} />
        <Route path='/crop' element={<CropPage />} />
        <Route path='/slice' element={<SlicePage />} />
        <Route path='/color' element={<ColorPage />} />
      </Routes>
    </div>
  );
}

export default App;

