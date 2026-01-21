<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSuratPerintahRequest;
use App\Http\Requests\UpdateSuratPerintahRequest;
use App\Models\SuratPerintah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SuratPerintahController extends Controller
{
    public function index(): Response
    {
        $suratPerintahs = SuratPerintah::with(['pejabatPenandatangan', 'pesertaPerjalanan.pegawai'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('SuratPerintah/Index', [
            'suratPerintahs' => $suratPerintahs,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('SuratPerintah/Create');
    }

    public function store(StoreSuratPerintahRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            $pesertaData = $validated['peserta'] ?? [];
            unset($validated['peserta']);

            $suratPerintah = SuratPerintah::create($validated);

            foreach ($pesertaData as $peserta) {
                $suratPerintah->pesertaPerjalanan()->create($peserta);
            }
        });

        return redirect()->route('surat-perintah.index')
            ->with('success', 'SPPD berhasil dibuat');
    }

    public function show(SuratPerintah $suratPerintah): Response
    {
        $suratPerintah->load(['pejabatPenandatangan', 'pesertaPerjalanan.pegawai']);

        return Inertia::render('SuratPerintah/Show', [
            'suratPerintah' => $suratPerintah,
        ]);
    }

    public function edit(SuratPerintah $suratPerintah): Response
    {
        $suratPerintah->load(['pejabatPenandatangan', 'pesertaPerjalanan.pegawai']);

        return Inertia::render('SuratPerintah/Edit', [
            'suratPerintah' => $suratPerintah,
        ]);
    }

    public function update(UpdateSuratPerintahRequest $request, SuratPerintah $suratPerintah): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $suratPerintah) {
            $pesertaData = $validated['peserta'] ?? [];
            unset($validated['peserta']);

            $suratPerintah->update($validated);

            // Sync Logic: Delete removed, update existing, create new
            $existingIds = $suratPerintah->pesertaPerjalanan()->pluck('pegawai_id')->toArray();
            $newIds = collect($pesertaData)->pluck('pegawai_id')->toArray();

            // Delete removed
            $toDelete = array_diff($existingIds, $newIds);
            if (! empty($toDelete)) {
                $suratPerintah->pesertaPerjalanan()->whereIn('pegawai_id', $toDelete)->delete();
            }

            // Update or Create
            foreach ($pesertaData as $peserta) {
                $suratPerintah->pesertaPerjalanan()->updateOrCreate(
                    ['pegawai_id' => $peserta['pegawai_id']],
                    ['peran' => $peserta['peran']]
                );
            }
        });

        return redirect()->route('surat-perintah.index')
            ->with('success', 'SPPD berhasil diperbarui');
    }

    public function destroy(SuratPerintah $suratPerintah): RedirectResponse
    {
        $suratPerintah->delete();

        return redirect()->route('surat-perintah.index')
            ->with('success', 'SPPD berhasil dihapus');
    }

    public function printSuratTugas(SuratPerintah $suratPerintah): Response
    {
        $suratPerintah->load(['pejabatPenandatangan', 'pesertaPerjalanan.pegawai']);

        return Inertia::render('SuratPerintah/PrintSuratTugas', [
            'suratPerintah' => $suratPerintah,
        ]);
    }

    public function printSPPDLembar1(SuratPerintah $suratPerintah): Response
    {
        $suratPerintah->load(['pejabatPenandatangan', 'pesertaPerjalanan.pegawai']);

        return Inertia::render('SuratPerintah/PrintSPPDLembar1', [
            'suratPerintah' => $suratPerintah,
        ]);
    }
}
