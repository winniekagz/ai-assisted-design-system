export function TypographyExample() {
  return (
    <div className='space-y-8 p-8'>
      {/* Page Header */}
      <div className='text-[6em] font-medium leading-[100%] tracking-[1.5px] text-neutral-300 align-middle'>
        Page Header Title
      </div>

      {/* H1 */}
      <h1 className='text-[75px] font-medium leading-[100%] tracking-[-2px] align-middle md:text-[75px] sm:text-[60px] sm:tracking-[-5%]'>
        Heading 1 - Main Title
      </h1>

      {/* H2 */}
      <h2 className='text-[50px] font-medium leading-[100%] tracking-[-3%] align-baseline md:text-[50px] sm:text-[30px] sm:tracking-[-2px]'>
        Heading 2 - Section Title
      </h2>

      {/* H3 */}
      <h3 className='text-[30px] font-medium leading-[100%] tracking-[-2px] align-baseline md:text-[30px] sm:text-[24px] sm:tracking-[-3px]'>
        Heading 3 - Subsection Title
      </h3>

      {/* H4 */}
      <h4 className='text-[21px] font-medium leading-[120%] tracking-[0px] align-baseline sm:tracking-[-3%]'>
        Heading 4 - Subsection
      </h4>

      {/* H5 */}
      <h5 className='text-[1.5em] font-medium leading-[133%] tracking-[0.5%] align-baseline'>
        Heading 5 - Subsection
      </h5>

      {/* H6 */}
      <h6 className='text-[1.25rem] font-normal leading-[160%] tracking-[0.15px] align-baseline'>
        Heading 6 - Subsection
      </h6>

      {/* Body Text */}
      <div className='text-base font-normal leading-[150%] tracking-[0.15%]'>
        This is body text using the Rubik font family. It demonstrates the
        typography tokens with proper font weight, line height, and letter
        spacing as specified in the design system.
      </div>

      {/* Body 2 */}
      <div className='text-[0.87rem] font-normal leading-[143%] tracking-[0.17%]'>
        This is body 2 text with smaller font size and adjusted line height for
        better readability.
      </div>

      {/* Button Large */}
      <button className='text-[26px] font-medium leading-[0.46] px-6 py-3 bg-primary-500 text-white border-none rounded-lg'>
        Large Button Text
      </button>

      {/* Link */}
      <a
        href='#'
        className='text-[16px] font-normal leading-[130%] tracking-[15px] text-primary-500 no-underline hover:underline'
      >
        Link Text Example
      </a>

      {/* Caption */}
      <div className='text-[14px] font-normal leading-[100%] tracking-[0px] text-text-secondary'>
        Caption text for additional information
      </div>

      {/* Small Text */}
      <div className='text-[14px] font-normal leading-[130%] tracking-[0px]'>
        Small text for fine print or secondary information
      </div>

      {/* Paragraph */}
      <p className='text-base font-normal leading-[130%] tracking-[0px]'>
        This is a paragraph with proper line height and spacing for optimal
        readability. The Rubik font family provides excellent legibility across
        different screen sizes.
      </p>
    </div>
  );
}
