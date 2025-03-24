-- Create tables for SupaSched
-- Enable UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Create availability table
CREATE TABLE IF NOT EXISTS public.availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    therapist_id UUID NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    recurrence TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create time_off table
CREATE TABLE IF NOT EXISTS public.time_off (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    therapist_id UUID NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    reason TEXT,
    recurrence TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    therapist_id UUID NOT NULL,
    client_id UUID,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT status_check CHECK (
        status IN (
            'pending',
            'confirmed',
            'cancelled',
            'rescheduled'
        )
    )
);
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_availability_therapist_time ON public.availability (therapist_id, start_time);
CREATE INDEX IF NOT EXISTS idx_time_off_therapist_time ON public.time_off (therapist_id, start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_therapist_time ON public.appointments (therapist_id, start_time);
-- Row Level Security (RLS) setup
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_off ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
-- Policies for availability
CREATE POLICY "Therapists can view their own availability" ON public.availability FOR
SELECT USING (auth.uid() = therapist_id);
CREATE POLICY "Therapists can insert their own availability" ON public.availability FOR
INSERT WITH CHECK (auth.uid() = therapist_id);
CREATE POLICY "Therapists can update their own availability" ON public.availability FOR
UPDATE USING (auth.uid() = therapist_id);
CREATE POLICY "Therapists can delete their own availability" ON public.availability FOR DELETE USING (auth.uid() = therapist_id);
-- Policies for time_off
CREATE POLICY "Therapists can view their own time_off" ON public.time_off FOR
SELECT USING (auth.uid() = therapist_id);
CREATE POLICY "Therapists can insert their own time_off" ON public.time_off FOR
INSERT WITH CHECK (auth.uid() = therapist_id);
CREATE POLICY "Therapists can update their own time_off" ON public.time_off FOR
UPDATE USING (auth.uid() = therapist_id);
CREATE POLICY "Therapists can delete their own time_off" ON public.time_off FOR DELETE USING (auth.uid() = therapist_id);
-- Policies for appointments
CREATE POLICY "Therapists can view their own appointments" ON public.appointments FOR
SELECT USING (auth.uid() = therapist_id);
CREATE POLICY "Therapists can insert their own appointments" ON public.appointments FOR
INSERT WITH CHECK (auth.uid() = therapist_id);
CREATE POLICY "Therapists can update their own appointments" ON public.appointments FOR
UPDATE USING (auth.uid() = therapist_id);
CREATE POLICY "Therapists can delete their own appointments" ON public.appointments FOR DELETE USING (auth.uid() = therapist_id);
-- Enable clients to book appointments (public booking widget)
CREATE POLICY "Anyone can insert appointments with status pending" ON public.appointments FOR
INSERT WITH CHECK (status = 'pending');
-- Basic audit triggers
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_availability_updated_at BEFORE
UPDATE ON public.availability FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_time_off_updated_at BEFORE
UPDATE ON public.time_off FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_appointments_updated_at BEFORE
UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();