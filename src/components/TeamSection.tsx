import { IMAGES } from '../config/images';

const TeamSection = () => {
    const teamMembers = [
        {
            name: 'Mauricio Magalhaes',
            role: 'Co-Founder / CEO',
            image: IMAGES.team.mauricio,
        },
        {
            name: 'Karine Kitz',
            role: 'Co-Founder & COO - Chief Operating Officer Global',
            image: IMAGES.team.karine,
        },
        {
            name: 'Reinaldo Macedo',
            role: 'COO Europe - Chief Operating Officer ',
            image: IMAGES.team.reinaldo,
        },
         {
            name: 'Fernanda Flauzino',
            role: 'CMO - Chief Marketing Officer LATAM',
            image: IMAGES.team.fernanda,
        },
        {
           name: 'Clayton Rafael',
           role: 'Lead Developer and Mastermind',
           image: IMAGES.team.clayton,
       },
    ];

    return (
        <div className="bg-black flex justify-center text-white">
            <div className="mx-auto max-w-7xl px-6 py-10 sm:py-10 flex flex-col items-center">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-semibold tracking-tight text-pretty sm:text-4xl">Meet StartUpX team</h2>
                    <p className="mt-6 text-lg/8 ">Dedicated professionals driving our success.</p>
                </div>
                <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-3 place-items-center">
                    {teamMembers.map((member, index) => (
                        <li key={index}>
                            <div className="flex flex-col items-center text-center">
                                <img className="size-[8rem] rounded-full mb-4" src={member.image} alt={member.name} />
                                <div>
                                    <h3 className="text-base/7 font-semibold tracking-tight">{member.name}</h3>
                                    <p className="text-sm/6 font-semibold text-indigo-400">{member.role}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default TeamSection