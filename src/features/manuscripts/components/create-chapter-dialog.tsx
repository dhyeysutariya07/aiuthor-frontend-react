import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateChapter } from '../hooks'

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    order_index: z.number().min(1, 'Order index must be at least 1'),
})

interface CreateChapterDialogProps {
    manuscriptId: string
}

export function CreateChapterDialog({ manuscriptId }: CreateChapterDialogProps) {
    const [open, setOpen] = useState(false)
    const createChapter = useCreateChapter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            order_index: 1,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        createChapter.mutate(
            {
                manuscriptId,
                data: values,
            },
            {
                onSuccess: () => {
                    setOpen(false)
                    form.reset()
                },
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size='sm' className='gap-1'>
                    <Plus className='h-4 w-4' />
                    Add Chapter
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Chapter</DialogTitle>
                    <DialogDescription>
                        Add a new chapter to your manuscript.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter chapter title' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='order_index'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Order Index</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type='submit' disabled={createChapter.isPending}>
                                {createChapter.isPending ? 'Creating...' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
