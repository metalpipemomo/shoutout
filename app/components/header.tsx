import { Form } from '@remix-run/react';
import { useState } from 'react';

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header
			className={'flex flex-row items-center justify-between p-4 shadow-md'}
		>
			<div className={'text-2xl font-bold tracking-widest'}>SHOUTOUT</div>
			<div className={'hidden space-x-4 md:flex'}>
				<button
					className={
						'rounded bg-blue-500 px-4 py-2 font-semibold text-white shadow-md'
					}
				>
					Account
				</button>
				<button
					className={
						'rounded bg-red-500 px-4 py-2 font-semibold text-white shadow-md'
					}
				>
					Sign Out
				</button>
			</div>
			<div className={'md:hidden'}>
				<button
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					className={'focus:outline-none'}
				>
					<svg
						className={'h-6 w-6'}
						fill={'none'}
						stroke={'currentColor'}
						viewBox={'0 0 24 24'}
						xmlns={'http://www.w3.org/2000/svg'}
					>
						<path
							strokeLinecap={'round'}
							strokeLinejoin={'round'}
							strokeWidth={'2'}
							d={'M4 6h16M4 12h16m-7 6h7'}
						></path>
					</svg>
				</button>
			</div>
			{isMenuOpen && (
				<div
					className={
						'fixed inset-0 z-50 flex justify-end bg-gray-900 bg-opacity-75'
					}
				>
					<div className={'h-full w-64 bg-white'}>
						<button
							onClick={() => setIsMenuOpen(false)}
							className={'m-4 text-xl text-gray-900 focus:outline-none'}
						>
							&times;
						</button>
						<nav className={'mt-2 flex flex-col'}>
							<button
								className={
									'border-b border-t py-4 transition duration-200 ease-in-out hover:bg-gray-200'
								}
							>
								Account
							</button>
							<Form
								action={'/logout'}
								method={'post'}
								className={
									'flex items-center justify-center border-b py-4 transition duration-200 ease-in-out hover:bg-gray-200'
								}
							>
								<button type={'submit'} className={'w-full'}>Sign Out</button>
							</Form>
						</nav>
					</div>
				</div>
			)}
		</header>
	);
}
