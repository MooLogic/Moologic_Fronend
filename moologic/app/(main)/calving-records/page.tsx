'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { CalvingRecordForm } from '@/components/calving-record-form';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { columns } from './components/columns';
import { format } from 'date-fns';
import { useGetBirthRecordsQuery, useDeleteBirthRecordMutation } from '@/lib/service/cattleService';
import { DecorativeBackground } from "@/components/decorative-background";

interface ExtendedSession extends Record<string, any> {
  user: {
    accessToken: string;
    [key: string]: any;
  };
}

export default function CalvingRecordsPage() {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Debug logging for session and token
  console.log('Session:', session);
  console.log('Access Token:', session?.user?.accessToken);

  const { data: birthRecords, isLoading, error } = useGetBirthRecordsQuery(
    { accessToken: session?.user?.accessToken || '' },
    { 
      skip: !session?.user?.accessToken,
      // Refetch every 30 seconds
      pollingInterval: 30000,
    }
  );

  // Debug logging for birth records
  console.log('Birth Records:', birthRecords);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  const [deleteBirthRecord] = useDeleteBirthRecordMutation();

  const handleDelete = async (id: number) => {
    try {
      await deleteBirthRecord({
        accessToken: session?.user?.accessToken || '',
        id,
      }).unwrap();
      toast({
        title: 'Success',
        description: 'Birth record deleted successfully',
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete birth record',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (record: any) => {
    setSelectedRecord(record);
    setIsFormOpen(true);
  };

  const formattedData = birthRecords?.results?.map((record: any) => ({
    ...record,
    calving_date: format(new Date(record.calving_date), 'PPP'),
    cattle_tag: record.mother_ear_tag || 'Unknown',
    calf_details: `${record.calf_count} calf(s) - ${record.calf_ear_tag}`,
  })) || [];

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading birth records...</div>;
  if (error) {
    console.error('Birth records error:', error);
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error loading birth records</div>;
  }

  return (
    <div className="relative p-6">
      <DecorativeBackground />
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calving Records</h1>
            <p className="mt-2 text-sm text-gray-600">Track and manage birth records for your cattle</p>
          </div>
          <Button onClick={() => {
            setSelectedRecord(null);
            setIsFormOpen(true);
          }}>
            Add New Record
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <DataTable
            columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
            data={formattedData}
          />
        </div>

        <CalvingRecordForm
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedRecord(null);
          }}
          record={selectedRecord}
        />
      </div>
    </div>
  );
}

