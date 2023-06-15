import React, { ChangeEvent, useState, useTransition } from 'react'
import Input from '../Input'
import useTranslate from '@/hooks/useTranslate'
import { IoSearchOutline } from 'react-icons/io5'
import Avatar from 'react-avatar'
import { useGetUserApi } from '@/service/UserService'

interface Props {

}

const ModalSearchUser: React.FC<Props> = () => {
    const t = useTranslate()
    const [email, setEmail] = useState<string>("")
    const [isPending, startTransition] = useTransition()

    useGetUserApi({
        options: {
            enabled: !!email,
            onSuccess: ({ results }: { results: UserType[] }) => {
                console.log(results);
            }
        },
        query: {
            email
        }
    })

    const handleChangeSearch = (value: string) => {
        // startTransition(() => {
        //     setEmail(value)
        // })
    }


    return (
        <>
            <input type="checkbox" id="modal-search-user" className='modal-toggle' />
            <div className='modal'>
                <div className="modal-box max-w-[900px]">
                    <Input placeholder={t.home.tab.contact.searchHint} value={email} onChange={handleChangeSearch} iconStart={<IoSearchOutline size={20} />} />
                    <ul className='flex flex-col gap-2.5 mt-5'>
                        <li className='flex items-center justify-between'>
                            <div className='flex gap-2.5 items-center'>
                                <Avatar size={"40px"} round name="tran Huu tai" />
                                <p>Tran Huu Tai</p>
                            </div>
                            <div>
                                <button className='btn btn-sm btn-outline btn-info'>Add</button>
                            </div>
                        </li>
                    </ul>
                </div>
                <label className="modal-backdrop" htmlFor="modal-search-user">Close</label>
            </div>
        </>
    )
}

export default ModalSearchUser