import Image from 'next/image';

export default function Home() {
  console.log('humm');
  return (
    <div>
      <Image
        src="./window.svg"
        alt="window svg"
        width={16}
        height={16}
        priority
      />
      <div>
        Hello <code style={{ color: 'red' }}>Github Pages!</code>
      </div>
    </div>
  );
}
