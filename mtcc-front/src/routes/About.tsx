export default function About() {
  return (
    <div className='pb-20 pt-24 flex flex-col items-center'>
    <div className='flex flex-col justify-center items-center text-center mb-16 w-5/12'>
      <h1 className="scroll-m-20 text-7xl font-extrabold tracking-tight lg:text-8xl text-transparent bg-clip-text bg-gradient-to-t from-[#8c52ff] to-[#f6e4ff]">About</h1>
      <p className='leading-relaxed mt-6'>mtcc (<b className='text-[#8C52FF]'>m</b>usic <b className='text-[#8C52FF]'>t</b>orrent <b className='text-[#8C52FF]'>c</b>ontent <b className='text-[#8C52FF]'>c</b>reator) is a sophisticated web application designed for rapid music torrent uploads to Ygg. It encompasses a presentation generator and an Nfo builder for a seamless experience.</p>
    </div>
    <div className='space-y-4 w-5/12'>
      <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>Why mtcc?</h3>
      <p className='leading-relaxed mt-6'>The manual process of generating an Nfo and crafting a presentation is often tedious. mtcc simplifies this with an integrated solution, eliminating the need for manual data entry.</p>
      <p className='leading-relaxed mt-6'>Furthermore, it intelligently auto-generates the torrent's name for you.</p>
      <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>Introducing mtcc PRES</h3>
      <p className='leading-relaxed mt-6'>mtcc PRES is a streamlined BBCODE presentation generator that leverages the Deezer API for its resource acquisition.</p>
      <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>The mtcc Nfo Builder Advantage</h3>
      <p className='leading-relaxed mt-6'>Nfo Builder utilizes MediaInfo to extract accurate data from audio files, ensuring that your NFO contains reliable, 100% verified information.</p>
      <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>Data Privacy and Storage</h3>
      <p className='leading-relaxed mt-6'>mtcc operates without retaining any data—everything is processed instantly and securely.</p>
      <p className='leading-relaxed mt-6'>Nevertheless, to enhance user convenience, mtcc stores necessary data locally in your browser, sparing you from repetitive data entry on subsequent uses.</p>
    </div>
  </div>
  
  )
}
