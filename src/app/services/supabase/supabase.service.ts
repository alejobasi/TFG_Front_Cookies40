import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase!: SupabaseClient;

  constructor() {
    // Reemplaza estos valores con tus credenciales de Supabase del environment
    this.supabase = createClient(
      'https://igrzrddmxndcycgvjpnq.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlncnpyZGRteG5kY3ljZ3ZqcG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxOTQ5MjYsImV4cCI6MjA1OTc3MDkyNn0.fJeo8W2YtdmiRp3u2qVMMUIS_vYrmbpM3GrqyTXQtnQ'
    );
  }

  uploadImage(bucket: string, path: string, file: File): Observable<string> {
    return from(
      this.supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      })
    ).pipe(
      map((result) => {
        if (result.error) {
          throw result.error;
        }

        return this.supabase.storage.from(bucket).getPublicUrl(path).data
          .publicUrl;
      })
    );
  }
}
